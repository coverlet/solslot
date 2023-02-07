use anchor_lang::prelude::*;
use anchor_lang::system_program;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("AAEbKDHrGn2doRWAXuxEeNStMoxqe3qpCATHZkMuTcNy");

const TREASURY_PDA_SEED: &[u8] = b"treasury";
const USER_VAULT_SEED: &[u8] = b"uvault";
const BET_AMOUNT: u64 = 100000000; // 0.1 SOL

// :/
const RENT: u64 = 967440;

// G6zgKnprA4bsS1KNLec1Bo75h4mNR12MNwQFdhr5ssmR
// 254

#[program]
pub mod slots {
    use super::*;
    // handler function
    pub fn init(ctx: Context<CreateVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.spin = 0;
        vault.seed = RENT;
        msg!(
            "Initiated pda vault with key {}",
            vault.to_account_info().key
        );
        Ok(())
    }

    pub fn create_user_vault(ctx: Context<CreateUserVault>) -> Result<()> {
        msg!(
            "Initiated user vault with key {} ",
            ctx.accounts.user_vault.to_account_info().key
        );
        Ok(())
    }

    pub fn spin(ctx: Context<Spin>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.spin += 1;

        let mut seed = vault.seed;
        seed ^= seed >> 12;
        seed ^= seed << 25;
        seed ^= seed >> 27;
        seed *= 0x2545F4914F6CDD1D;

        vault.seed = seed;

        let win_decider = seed % 20;
        let mut win = 0;
        let mut win_amount: u64 = 0;

        if win_decider > 17 {
            // mega win
            win = 3;
            win_amount = BET_AMOUNT * 2;
        } else if win_decider > 14 {
            // big win
            win = 2;
            win_amount = BET_AMOUNT;
        } else if win_decider > 8 {
            // small win
            win = 1;
            win_amount = BET_AMOUNT / 2;
        }

        msg!(
            "This is spin #{}, result: {} - {}",
            vault.spin,
            win_decider,
            win
        );

        // send bet amount to vault
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, BET_AMOUNT)?;

        // if won, send rewards to users pda
        if win > 0 {
            **ctx
                .accounts
                .vault
                .to_account_info()
                .try_borrow_mut_lamports()? -= win_amount;
            **ctx
                .accounts
                .user_vault
                .to_account_info()
                .try_borrow_mut_lamports()? += win_amount;
        }

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let user_vault_lamports = ctx.accounts.user_vault.to_account_info().lamports();
        let signer_lamports = ctx.accounts.signer.to_account_info().lamports();
        let claimable = user_vault_lamports.checked_sub(RENT).unwrap();

        **ctx
            .accounts
            .user_vault
            .to_account_info()
            .try_borrow_mut_lamports()? = RENT;
        **ctx
            .accounts
            .signer
            .to_account_info()
            .try_borrow_mut_lamports()? = signer_lamports.checked_add(claimable).unwrap();

        Ok(())
    }
}


#[account]
pub struct Vault {
    spin: u16,
    seed: u64,
}

#[account]
pub struct UserVault {}

#[derive(Accounts)]
pub struct Spin<'info> {
    #[account(mut, seeds = [TREASURY_PDA_SEED], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut, seeds = [USER_VAULT_SEED, signer.key().as_ref()], bump)]
    pub user_vault: Account<'info, UserVault>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(mut, seeds = [USER_VAULT_SEED, signer.key().as_ref()], bump)]
    pub user_vault: Account<'info, UserVault>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + 2 + 8, seeds = [TREASURY_PDA_SEED], bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUserVault<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + 2 + 1, seeds = [USER_VAULT_SEED, signer.key().as_ref()], bump
    )]
    pub user_vault: Account<'info, UserVault>,
    pub system_program: Program<'info, System>,
}

